// export default async function playAudio(path: string) {
//   const audio = new Audio(path);
//   audio.play();
// }

export default function playAudio(path: string, callback?: () => void) {
  const play = new Promise((resolve, reject) => {
    const audio = new Audio(path);
    audio.play();
    audio.onended = () => {
      resolve(true);
    };

    audio.onerror = () => {
      reject(false);
    };
  });

  play.then(callback);
}
