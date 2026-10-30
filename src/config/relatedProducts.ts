import { product } from "./product";

const products = [
  {
    id: "foldora",
    name: "Foldora AI",
    description: "Organizes and renames files locally on Windows and macOS.",
    url: "https://foldoraai.com/",
    icon: "https://foldoraai.com/foldora-logo-32.png",
  },
  {
    id: "cleanora",
    name: "Cleanora AI",
    description: "Sorts files into folders to clean up Windows directories.",
    url: "https://cleanoraai.com/",
    icon: "https://cleanoraai.com/icon-192.png",
  },
  {
    id: "galoria",
    name: "Galoria AI",
    description: "Organizes photos locally on Windows.",
    url: "https://galoriaai.com/",
    icon: "https://galoriaai.com/icon-192.png",
  },
];

export const relatedProducts = products.filter(
  (item) => item.id !== product.productName.toLowerCase(),
);
