const propof = <T>(name: keyof T) => name as string

type KeyOf<T extends object> = keyof T & string
type RecursivePartial<T> = {
  [K in keyof T]?: RecursivePartial<T[K]>
}
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export { propof, KeyOf, RecursivePartial, WithOptional }
