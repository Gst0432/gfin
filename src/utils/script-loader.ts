export function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Échec du chargement du script: ${src}`));
    
    document.body.appendChild(script);
  });
}