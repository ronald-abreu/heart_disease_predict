const resultDiv = document.getElementById('result');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('form');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="loading-spinner"></div> Carregando...';

  resultDiv.style.opacity = 0;

  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = parseFloat(value);
  });

  try {
    const response = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const json = await response.json();

    resultDiv.style.opacity = 1;
    resultDiv.style.transform = 'translateY(0)';
    resultDiv.className = "";
    resultDiv.style.animation = 'pop 0.4s ease';

    if (json.prediction !== undefined) {
      let text = "";
      let icon = "";
      let sound = null;

      if (json.prediction >= 0.7) {
        text = "High risk of heart problem";
        icon = '<i class="fas fa-times-circle"></i>';
        resultDiv.classList.add('negative');
        sound = document.getElementById('sound-negative');
      } else if (json.prediction >= 0.4) {
        text = "Moderate risk, attention recommended";
        icon = '<i class="fas fa-exclamation-triangle"></i>';
        resultDiv.classList.add('moderate');
        sound = document.getElementById('sound-moderate');
      } else {
        text = "Low risk, keep taking care!";
        icon = '<i class="fas fa-check-circle"></i>';
        resultDiv.classList.add('positive');
        sound = document.getElementById('sound-positive');
      }

      resultDiv.innerHTML = icon + "<div>" + text + "</div>";
      sound.play();
    } else {
      resultDiv.innerHTML = '<i class="fas fa-times-circle"></i> Erro: ' + json.error;
      resultDiv.classList.add('negative');
      document.getElementById('sound-negative').play();
    }
  } catch (error) {
    resultDiv.style.opacity = 1;
    resultDiv.innerHTML = '<i class="fas fa-times-circle"></i> Erro de request: ' + error.message;
    resultDiv.classList.add('negative');
    document.getElementById('sound-negative').play();
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit</span>';
  }
});
