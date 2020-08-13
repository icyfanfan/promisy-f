/**
 * This file is just a silly example to show everything working in the browser.
 * When you're ready to start on your site, clear the file. Happy hacking!
 **/

import PromiseMoc from './lib';

PromiseMoc.resolve(1).then(val => console.log('static resolve', val));
PromiseMoc.reject(1).catch(err => console.log('static reject', err));


const p = new PromiseMoc((res, rej) => {
  rej(1);
});

// p.catch(err => {
//   console.log('in catch', err);
// }).then(val => {
//   console.log(val);
// })

p.then(val => {
  console.log('wont show', val);
}).catch(err => {
  console.log('in catch', err);
}).finally(() => {
  console.log('infinally');
})

// p
// .then((val) => {
//   console.log(val);
//   return new PromiseMoc((res, rej) => {
//     res(2)
//   })
// })
// .then((val) => {
//   console.log(val);
//   return new PromiseMoc((res, rej) => {
//     res(new PromiseMoc((res, rej) => {
//       res(new PromiseMoc((res, rej) => {
//         res(3)
//       }))
//     }))
//   })
// })
// .then((val) => {
//   console.log(val);
//   return PromiseMoc.reject(4);
// })
// .then((val) => {
//   console.log('wont show', val);
// })
// .catch((err) => {
//   console.log('in catch', err);
// })