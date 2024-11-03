export interface WorkstationResponse {
    Workstation: Workstation;
    Error?: WorkstationError;
}

interface WorkstationError {
    Message: string;
}

interface Workstation {
    ID: string;
    Description: string;
    ATMMessage: string;
    ModPrintBO: string;
    ModPrintConc: string;
    UseAgent: string;
    User: string;
    SaleBoxOffice: string;
    SaleConcessions: string;
    Enabled: string;
    ManualSale: string;
    ToleranceShowtime: string;
    Type: string;
    ReceiptPrinter: string;
    ImpBoxPuerto: string;
    ImpConcPuerto: string;
    ImpCompConcPuerto: string;
    ImpVoucherPuerto: string;
    ImpConc2Puerto: string;
    IPAddress: string;
}