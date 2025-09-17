
import { Button } from './ui/button';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onConfirm: () => void;
}

export default function Keypad({ onKeyPress, onConfirm }: KeypadProps) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-2xl">
      <div className="grid grid-cols-3 gap-3">
        {keys.map((key) => (
          <Button
            key={key}
            onClick={() => onKeyPress(key)}
            className="w-20 h-14 bg-gray-700 hover:bg-gray-600 text-white text-2xl font-bold"
          >
            {key}
          </Button>
        ))}
      </div>
      <div className="flex justify-center gap-3 mt-3">
        <Button 
            onClick={() => onKeyPress('LIMPA')}
            className="w-28 h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold"
        >
            CORRIGE
        </Button>
        <Button 
            onClick={onConfirm}
            className="w-28 h-12 bg-green-600 hover:bg-green-700 text-white font-bold"
        >
            CONFIRMA
        </Button>
      </div>
    </div>
  );
}
