const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'ALPHA_VANTAGE_API_KEY':
        return '3600';
      case 'ALPHA_VANTAGE_BASE_URL':
        return 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE';
    }
  },
};

export default mockedConfigService;
