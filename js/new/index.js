function wait() {
  return new Promise(resolve =>
    setTimeout(resolve, 10 * 1000)
  )
}

async function main() {
  const start = +new Date()
  console.log(start);
  const x = wait();
  const y = wait();
  const z = wait();
  await x;
  await y;
  await z;
  const end = +new Date()
  console.log(end);
  console.log(end - start);
}
main();