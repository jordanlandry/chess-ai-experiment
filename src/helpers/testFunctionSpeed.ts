export default function testFunctionSpeed(callback: Function, name: string) {
  const maxMs = 1000;

  let i = 0;
  const startTime = performance.now();
  while (performance.now() - startTime < maxMs) {
    callback();
    i++;
  }

  console.log(`${name}: ${i.toLocaleString()} iterations in ${maxMs}ms`);
}
