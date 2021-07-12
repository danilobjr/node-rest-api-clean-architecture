import {
  Document,
  DocumentQuery as MongooseDocumentQuery,
  FilterQuery,
  Model,
  UpdateQuery,
} from 'mongoose'
import { Entity } from '../../domain'
import { RecursivePartial } from '../../utils'

type Search = {
  searchTerm?: string
}

type Pagination = {
  skip?: number
  limit?: number
}

type Sort<T> = {
  sortBy?: keyof T
  ordering?: 1 | -1
}

type Query<T> = Pagination & Sort<T> & Search

type DocumentQuery<D> = MongooseDocumentQuery<D, Document, {}>

interface IBaseRepo<T> {
  find: (query?: Query<T>) => Promise<T[]>
  findBy: <F extends keyof T>(
    field: F,
    value: T[F],
    query?: Query<T>,
  ) => Promise<T[]>
  findByIds: (ids: string[]) => Promise<T[]>
  findOneBy: <F extends keyof T>(field: F, value: T[F]) => Promise<T>
  findById: (id: string) => Promise<T>
  create: (entity: T) => Promise<T>
  insertMany: (entitys: T[]) => Promise<T[]>
  update: (id: string, partialEntity: RecursivePartial<T>) => Promise<T>
  updateOrCreateBy: <F extends keyof T>(
    field: F,
    value: T[F],
    partialEntityData: RecursivePartial<T>,
  ) => Promise<void>
  remove: (id: string) => Promise<T>
  removeMany: (ids: string[]) => Promise<void>
}

// abstract class BaseRepo<T extends Entity, D extends Document> {
abstract class BaseRepo<T extends Entity, D extends Document>
  implements IBaseRepo<T>
{
  protected readonly query: Query<T> = {
    limit: 10,
    skip: 0,
  }

  protected get limit() {
    return this.query.limit
  }

  protected get skip() {
    return this.query.skip
  }

  protected get sort() {
    const { sortBy, ordering } = this.query

    return {
      [sortBy]: ordering,
    }
  }

  constructor(
    protected model: Model<D>,
    private defaultSort: Sort<T> = {},
    private fieldsToPopulate: (keyof T)[] = [],
  ) {
    const sort: Sort<T> = {
      ...this.defaultSort,
      ordering: this.defaultSort?.ordering || 1,
    }

    this.query = {
      ...this.query,
      ...sort,
    }
  }

  // TODO refactor with DRY principle in mind. Check this and findBy()
  async find(query: Query<T> = this.query) {
    const { skip, limit, sortBy, ordering, searchTerm } = {
      ...(this.query || {}),
      ...query,
    }

    const sort = { [sortBy]: ordering }
    const textIndex = searchTerm
      ? ({ $text: { $search: searchTerm } } as FilterQuery<D>)
      : null

    const documents = await this.populate(
      this.model.find(textIndex).limit(limit).skip(skip).sort(sort),
    )

    return documents?.map(this.mapDocumentToEntity)
  }

  async findBy<F extends keyof T>(
    field: F,
    value: T[F],
    query: Query<T> = this.query,
  ) {
    const { skip, limit, sortBy, ordering } = {
      ...(this.query || {}),
      ...query,
    }

    const sort = { [sortBy]: ordering }
    const filterQuery = { [field]: value } as FilterQuery<D>

    const documents = await this.populate(
      this.model
        .find(filterQuery)
        .limit(limit as number)
        .skip(skip as number)
        .sort(sort),
    )

    return documents?.map(this.mapDocumentToEntity)
  }

  async findByIds(ids: string[]) {
    const filterQuery = {
      _id: { $in: ids },
    } as FilterQuery<D>

    const documents = await this.populate(this.model.find(filterQuery))

    return documents?.map(this.mapDocumentToEntity)
  }

  async findOneBy<F extends keyof T>(field: F, value: T[F]) {
    const filterQuery = { [field]: value } as FilterQuery<D>
    const document = await this.populate(this.model.findOne(filterQuery))

    if (!document) {
      return null
    }

    document._id = document._id.toString()

    return this.mapDocumentToEntity(document)
  }

  async findById(id: string) {
    const document = await this.populate(this.model.findById(id))

    if (!document) {
      return null
    }

    document._id = document._id.toString()

    return this.mapDocumentToEntity(document)
  }

  async create(entity: T) {
    const document = await this.model.create(entity)
    return this.mapDocumentToEntity(document)
  }

  async insertMany(entitys: T[]) {
    const documents = await this.model.insertMany(entitys)
    return documents.map(this.mapDocumentToEntity)
  }

  async update(id: string, partialEntity: RecursivePartial<T>) {
    const updateQuery = { $set: partialEntity } as UpdateQuery<D>

    const document = await this.model.findByIdAndUpdate(id, updateQuery)

    return this.mapDocumentToEntity(document)
  }

  async updateOrCreateBy<F extends keyof T>(
    field: F,
    value: T[F],
    partialEntityData: RecursivePartial<T>,
  ) {
    const filterQuery = { [field]: value } as FilterQuery<D>
    const updateQuery = { $set: partialEntityData } as UpdateQuery<D>
    const options = { upsert: true }

    await this.model.updateOne(filterQuery, updateQuery, options)
  }

  async remove(id: string) {
    const document = await this.populate(this.model.findByIdAndRemove(id))

    if (!document) {
      return null
    }

    document._id = document._id.toString()

    return this.mapDocumentToEntity(document)
  }

  async removeMany(ids: string[]) {
    const filterQuery = { _id: ids } as FilterQuery<D>
    await this.model.deleteMany(filterQuery)
  }

  protected abstract mapDocumentToEntity(document: Document): T

  protected populate<D>(document: DocumentQuery<D>): DocumentQuery<D> {
    if (this.fieldsToPopulate) {
      return this.fieldsToPopulate.reduce(
        (document, currentField) => document.populate(currentField),
        document,
      )
    }

    return document
  }
}

export { IBaseRepo, BaseRepo, Query as RepoQuery }
