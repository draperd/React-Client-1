const users = {
  4: {name: 'Mark'},
  5: {name: 'Paul'},
};

export default function request(url) {
  return new Promise((resolve, reject) => {
    process.nextTick(
      () => resolve({
         response: {
            data: {
               list: [1,2,3]
            }
         }
      });
    );
  });
}