import randomNumber from 'random-number-csprng'
import { IRandomNumberService } from './IRandomNumberService'

const MIN_CODE_NUMBER = 100000
const MAX_CODE_NUMBER = 999999

class RandomNumberService implements IRandomNumberService {
  generate(min = MIN_CODE_NUMBER, max = MAX_CODE_NUMBER) {
    return randomNumber(min, max)
  }
}

export { RandomNumberService }
