const client = {
  __response__: null,
  get: jest.fn().mockImplementation((url, options) => {
    return {
      url,
      body: { ...options },
      json: jest
        .fn()
        .mockReturnValue(
          client.__response__ instanceof Error
            ? Promise.reject(client.__response__)
            : Promise.resolve(client.__response__)
        ),
    };
  }),
  post: jest.fn().mockImplementation((url, options) => {
    if (client.__response__ instanceof Error) {
      throw client.__response__;
    }
    return {
      url,
      body: { ...options },
      json: jest
        .fn()
        .mockReturnValue(
          client.__response__ instanceof Error
            ? Promise.reject(client.__response__)
            : Promise.resolve(client.__response__)
        ),
    };
  }),
};

module.exports = client;
