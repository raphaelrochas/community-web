export function isEmpty(input: string, condition: number): boolean {
    return input.trim().length >= condition;
}

export function isEqual(val1: any, val2: any): boolean {
    return val1 === val2
}