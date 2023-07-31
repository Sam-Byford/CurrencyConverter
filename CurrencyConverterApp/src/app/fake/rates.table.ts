import { LatestRate } from "../modals";

//Note: all rates accurate as of 30/07/2023

export class RatesTable {
    public static rates: LatestRate[] = [
        {
            success: true,
            timestamp: 1690717024,
            base: "EUR",
            date: "2023-07-30",
            rates: {
                "GBP": 0.858741,
                "USD": 1.103139,
                "EUR": 1,
                "JPY": 155.702593
            }            
        },
        {
            success: true,
            timestamp: 1690717024,
            base: "GBP",
            date: "2023-07-30",
            rates: {
                "GBP": 1,
                "USD": 1.284500,
                "EUR": 1.165680,
                "JPY": 181.314000
            }            
        },
        {
            success: true,
            timestamp: 1690717024,
            base: "USD",
            date: "2023-07-30",
            rates: {
                "GBP": 0.778499,
                "USD": 1,
                "EUR": 0.907483,
                "JPY": 141.153000 
            }            
        },
        {
            success: true,
            timestamp: 1690717024,
            base: "JPY",
            date: "2023-07-30",
            rates: {
                "GBP": 0.005515,
                "USD": 0.007085,
                "EUR": 0.006429,
                "JPY": 1
            }            
        }
    ]
}