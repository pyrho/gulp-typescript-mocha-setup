export function add(i: number): number {
    if (i == null) {
        throw new Error('Input is null!');
    }
    return i +1;
}
