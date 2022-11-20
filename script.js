// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// o link para o seu modelo fornecido pelo painel de exportação Teachable Machine
const btnChangeCamera = document.querySelector("#btnChangeCamera");
const URL = "https://teachablemachine.withgoogle.com/models/CCaZVIUPA/";

let model, webcam, labelContainer, maxPredictions;

let useFrontCamera = true;

// troca de câmera
btnChangeCamera.addEventListener("click", function () {
  useFrontCamera = !useFrontCamera;
  init();
});

// Carrega o modelo de imagem e configura a webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // carrega o modelo e os metadados
  // Consulte tmImage.loadFromFiles() na API para oferecer suporte a arquivos de um seletor de arquivos
  // ou arquivos do seu disco rígido local
  // Nota: a biblioteca pose adiciona o objeto "tmImage" à sua janela (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Função de conveniência para configurar uma webcam
  webcam = new tmImage.Webcam(300, 300, useFrontCamera); //largura, altura, flip
  if (useFrontCamera === false){
    await webcam.setup({ facingMode: "environment" });
  }
  await webcam.setup(); // solicita acesso à webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // acrescenta elementos ao DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // e rótulos de classe
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update(); // atualiza o quadro da webcam
  await predict();
  window.requestAnimationFrame(loop);
}

// executa a imagem da webcam através do modelo de imagem
async function predict() {
  // predict pode levar em uma imagem, vídeo ou elemento html de tela
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className +
      ": " +
      prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}