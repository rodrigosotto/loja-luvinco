export interface Product {
  id: number;
  nome: string;
  preco: number;
  marca: string;
  categoria: string;
  imagem?: string;
  disponivel: boolean;
}
