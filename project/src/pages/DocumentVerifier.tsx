// components/DocumentVerifier.tsx

import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const expectedName = 'John Doe';
const expectedNumber = '123456';

const DocumentVerifier: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      processImage(file);
    }
  };

  const processImage = async (file: File) => {
    setLoading(true);
    setResult('');
    try {
      const dataUrl = await readFileAsDataURL(file);

      const {
        data: { text },
      } = await Tesseract.recognize(dataUrl, 'eng', {
        logger: (m) => console.log(m),
      });

      console.log('Extracted Text:', text);

      const nameRegex = /([A-Z][a-z]+\s[A-Z][a-z]+)/;
      const numberRegex = /\b\d{5,}\b/;

      const nameMatch = text.match(nameRegex);
      const numberMatch = text.match(numberRegex);

      if (nameMatch && numberMatch) {
        const name = nameMatch[1].trim();
        const number = numberMatch[0].trim();

        const isNameMatch = name.toLowerCase() === expectedName.toLowerCase();
        const isNumberMatch = number === expectedNumber;

        setResult(`
          Extracted Name: ${name}
          Extracted Number: ${number}
          ${isNameMatch && isNumberMatch ? '✅ Match Found' : '❌ No Match'}
        `);
      } else {
        setResult('Could not extract name and number.');
      }
    } catch (error) {
      console.error(error);
      setResult('Error processing image.');
    } finally {
      setLoading(false);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '500px' }}>
      <h2>Document Verification</h2>
      <input type='file' accept='image/*' onChange={handleImageUpload} />
      {loading && <p>Processing image...</p>}
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{result}</pre>
    </div>
  );
};

export default DocumentVerifier;
