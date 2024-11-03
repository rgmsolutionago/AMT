import { SellOption } from "./utils/sellOption";

export interface IAppConfig {
  env: {
    name: string;
  };
  remote: {
    trans: string;
    info: string;
  };
  production: boolean;
  sellOption: SellOption;
  atmFilter: string;
  productsFilter: string;
  theatreID: number;
  theatreName: string;
  theatreGroupID: number;
  workstationId: number;
  timeToIdleWarningSeconds: number;
  timeFromIdleWarningToKickSeconds: number;
  showIntroScreen: boolean;
  withdraw: {
    maxTries: number;
    ticketCodeLength: number;
  };
  defaultMoviePoster: string;
  defaultProductImage: string;
  onlyWithdrawal: boolean;
  isQRWithdrawalEnabled: boolean;
  printer: {
    serviceBaseUrl: string;
    boxOffice: {
      name: string;
      port: string;
    },
    concession: {
      name: string;
      port: string;
    },
    receiptConcession: {
      name: string;
      port: string;
    }
  };
  availablePaymentMethods: [
    {
      name: string;
      paymentMethodCode: number;
      creditCardCSID: number;
      logo: string;
    }
  ];
  finalCustomer: {
    name: string;
    lastName: string;
    ID: number;
    telephone: string;
    email: string;
  };
  reloadCacheAfterMinutes: number;
  showPaymentMethodContactless: boolean;
  showPaymentMethodMagnetic: boolean;
  showPaymentMethodChip: boolean;
  paymentTimeoutSeconds: number;
  showClientInvoiceScreen: boolean;
}
