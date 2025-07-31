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
    console.log(json.previsao);

    resultDiv.style.opacity = 1;
    resultDiv.style.transform = 'translateY(0)';
    resultDiv.className = "";
    resultDiv.style.animation = 'pop 0.4s ease';

    if (json.previsao !== undefined) {
      let text = "";
      let icon = "";
      
      if (json.previsao >= 1) {
        text = "Alto risco de problema no coração";
        icon = '<i class="fas fa-times-circle"></i>';
        resultDiv.classList.add('negative');
        
      } else if (json.previsao >= 0.4) {
        text = "Risco moderado, atenção recomendada";
        icon = '<i class="fas fa-exclamation-triangle"></i>';
        resultDiv.classList.add('moderate');
        
      } else {
        text = "Baixo risco de problema! Mantenha assim";
        icon = '<i class="fas fa-check-circle"></i>';
        resultDiv.classList.add('positive');
        
      }

      resultDiv.innerHTML = icon + "<div>" + text + "</div>";
    
    } else {
      resultDiv.innerHTML = '<i class="fas fa-times-circle"></i> Erro: ' + json.error;
      resultDiv.classList.add('negative');
     
    }
  } catch (error) {
    resultDiv.style.opacity = 1;
    resultDiv.innerHTML = '<i class="fas fa-times-circle"></i> Erro de request: ' + error.message;
    resultDiv.classList.add('negative');
    
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit</span>';
  }
});
