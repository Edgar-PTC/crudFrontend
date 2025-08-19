import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/productService.js"

import { getCategories } from "../services/categoryService.js";

import { uploadImageToFolder } from "../services/imageService";

let currentPage = 0;
let currentSize = 10;

document.addEventListener('DOMContentLoaded', ()=>{
    const tableBody = document.querySelector("#itemsTable tbody");
    const form = document.getElementById("productForm");
    const modal = new bootstrap.Modal(document.getElementById("itemModal"));
    const modalLabel = document.getElementById("itemModalLabel");
    const btnAdd = document.getElementById("btnAdd");
    const select = document.getElementById("productCategory");

    // Input type="file"
    const imageFileInput = document.getElementById("productImageFile"); 
    // Campo hidden
    const imageUrlHidden = document.getElementById("productImageUrl"); 
    // Preview <img>  
    const imagePreview = document.getElementById("productImagePreview"); 

    if(imageFileInput && imagePreview){
        imageFileInput.addEventListener("change", () => {
            const file = imageFileInput.files?.[0];
            if(file){
                const reader = new FileReader();
                reader.onload = () => (imagePreview.src = reader.result);
                reader.readAsDataURL(file);
            } else {
                imagePreview.src = imageUrlHidden?.value || "";
            }
        });
    }

    const sizeSelector = document.getElementById("pageSize");
    sizeSelector.addEventListener("change", () => {
        currentSize = parseInt(sizeSelector.value);
        currentPage = 0;
        cargarProductos();
    });

    btnAdd.addEventListener("click", () => {
        limpiarFormulario();
        modalLabel.textContent = "Agregar Producto";
        modal.show();
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let id = form.productId.value;

        let finalImageUrl = imageUrlHidden?.value || "";
        const file = imageFileInput?.files?.[0];
        if(file){
            try{
                const data = await uploadImageToFolder(file, "products");
                finalImageUrl = data.url || "";
            } catch (err) {
                console.error("Error subiendo imagen: ", err);
                alert("No se pudo subir la imagen.Intenta nuevamente.")
                return;
            }
        }
        const payload = {
            nombre: form.productName.value.trim(),
            precio: Number(form.productPrice.value),
            descripcion: form.productDescription.value.trim(),
            stock: Number(form.productStock.value),
            fechaIngreso
        }
    });
});