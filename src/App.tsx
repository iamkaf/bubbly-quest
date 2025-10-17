import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">Hello, World!</h1>

      <div className="flex flex-col gap-4 items-center">
        <p className="text-muted-foreground">Tailwind v4 + shadcn setup complete!</p>

        <div className="flex gap-4">
          <Button
            variant="default"
            onClick={() => setIsDark(!isDark)}
          >
            Toggle Theme
          </Button>

          <Button variant="secondary">
            Secondary
          </Button>

          <Button variant="outline">
            Outline
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
