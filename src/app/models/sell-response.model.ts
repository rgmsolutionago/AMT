export interface SellResponse {
    Response: string;
    PrintStringTicket?: string;
    Error?: SellError;
    PrintStringConcessions?: string;
    PrintStringReceiptConecessions?: string;
}

interface SellError {
    Message: string;
}