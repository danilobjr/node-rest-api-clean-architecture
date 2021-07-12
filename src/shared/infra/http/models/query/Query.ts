import { SearchTerm } from './SearchTerm'
import { Pagination } from './Pagination'
import { Sort } from './Sort'

type Query = Pagination & Sort & SearchTerm

export { Query }
