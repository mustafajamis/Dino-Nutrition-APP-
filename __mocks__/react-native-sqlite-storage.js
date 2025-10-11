// Mock for react-native-sqlite-storage
const mockSQLite = {
  openDatabase: jest.fn(() => ({
    transaction: jest.fn((callback) => {
      callback({
        executeSql: jest.fn((query, params, successCallback, errorCallback) => {
          if (successCallback) {
            successCallback({}, { rows: { length: 0, item: () => ({}) } });
          }
        }),
      });
    }),
    close: jest.fn(),
  })),
  enablePromise: jest.fn(),
  DEBUG: jest.fn(),
};

export default mockSQLite;
