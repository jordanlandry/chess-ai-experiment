export default function testFunctionSpeed(callback: Function, name: string) {
  const start = performance.now();
  for (let i = 0; i < 5_000_000; i++) {
    callback();
  }

  const end = performance.now();

  console.log(name, "took", end - start + "ms");
}
