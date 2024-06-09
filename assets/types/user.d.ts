
declare module 'vue-the-mask';
export interface Contato {
  id?: number;
  pessoa: Pessoa;
  tag: string;
  email: null | string;
  telefone: string;
  tipoContato: string;
  privado: boolean;
  usuario: Usuario;
}

export interface ContatoComImagem extends Contato {
  contactImageUrl?: string;
  isFavorite?: boolean;
}

export interface Usuario {
  id: number;
  nome: string;
  dataNascimento: string;
  cpf: string;
  email: string;
  telefone: string;
  username: string;
  password: string;
}

export interface Pessoa {
  id: number;
  nome: string;
  cpf: string;
  endereco: Endereco;
  foto: Foto;
}

export interface Foto {
  id: string;
  name: string;
  type: string;
}

export interface Endereco {
  id: number;
  logradouro: string;
  numero: number;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}