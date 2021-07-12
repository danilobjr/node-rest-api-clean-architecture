const genders = ['male', 'female']
const gendersConst = [...genders] as const
type Gender = typeof gendersConst[number]

export { Gender, genders }
