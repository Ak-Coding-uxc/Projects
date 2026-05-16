const form = document.getElementById('swapForm');
const statusSection = document.getElementById('statusSection');
const resultSection = document.getElementById('resultSection');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const generateBtn = document.getElementById('generateBtn');

function setStatus(message, isError = false) {
  statusSection.textContent = message;
  statusSection.classList.toggle('error', isError);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const thumbnail = formData.get('thumbnail');
  const portrait = formData.get('portrait');

  if (!thumbnail?.name || !portrait?.name) {
    setStatus('Please choose both images before generating.', true);
    return;
  }

  generateBtn.disabled = true;
  setStatus('Generating... this can take a few seconds.');
  resultSection.classList.add('hidden');

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Generation failed.');
    }

    resultImage.src = data.image;
    downloadBtn.href = data.image;
    resultSection.classList.remove('hidden');
    setStatus('Done! Your face-swapped image is ready.');
  } catch (error) {
    setStatus(error.message || 'Something went wrong. Please try again.', true);
  } finally {
    generateBtn.disabled = false;
  }
});
