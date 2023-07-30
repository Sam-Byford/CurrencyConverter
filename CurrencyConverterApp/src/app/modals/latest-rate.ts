export type LatestRate = {
    success: boolean,
    timestamp: number,
    base: string,
    date: string,
    rates: rateObj
}

type rateObj = {
    [key: string]: number
}