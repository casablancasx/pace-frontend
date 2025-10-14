# AssuntoAutocomplete

Componente de autocomplete para buscar e selecionar assuntos.

## Características

- ✅ Busca dinâmica com debounce (400ms)
- ✅ Carregamento mínimo de 3 caracteres
- ✅ Destaque de termos pesquisados
- ✅ Navegação por teclado (ArrowUp, ArrowDown, Enter, Escape)
- ✅ Feedback visual de loading
- ✅ Tratamento de erros

## API

### Props

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|------|------|-------------|--------|-----------|
| `value` | `string` | Sim | - | Valor atual do input |
| `onChange` | `(value: string) => void` | Sim | - | Callback quando o valor do input muda |
| `onSelect` | `(assunto: AssuntoResponse) => void` | Sim | - | Callback quando um assunto é selecionado |
| `placeholder` | `string` | Não | `"Digite o assunto"` | Placeholder do input |
| `minLength` | `number` | Não | `3` | Número mínimo de caracteres para iniciar a busca |
| `disabled` | `boolean` | Não | `false` | Se o componente está desabilitado |

### Tipos

```typescript
interface AssuntoResponse {
  assuntoId: number;
  assunto: string;
}
```

## Uso

```tsx
import AssuntoAutocomplete from '../../components/AssuntoAutocomplete';

function MeuComponente() {
  const [assuntoInputValue, setAssuntoInputValue] = useState('');
  const [assuntoId, setAssuntoId] = useState<number | null>(null);

  return (
    <AssuntoAutocomplete
      value={assuntoInputValue}
      onChange={(newValue) => setAssuntoInputValue(newValue)}
      onSelect={(assunto) => {
        setAssuntoId(assunto.assuntoId);
        setAssuntoInputValue(assunto.assunto);
        // Fazer algo com o assunto selecionado
      }}
      placeholder="Digite o assunto"
      minLength={3}
    />
  );
}
```

## Endpoint

O componente consome o endpoint `/assunto?nome={nome}` que retorna:

```typescript
Array<{
  assuntoId: number;
  assunto: string;
}>
```

## Navegação por Teclado

- **↓ (ArrowDown)**: Move para a próxima opção
- **↑ (ArrowUp)**: Move para a opção anterior
- **Enter**: Seleciona a opção destacada
- **Escape**: Fecha o dropdown
