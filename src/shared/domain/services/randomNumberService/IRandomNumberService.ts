interface IRandomNumberService {
  generate: (min?: number, max?: number) => Promise<number>
}

export { IRandomNumberService }
