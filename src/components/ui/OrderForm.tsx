import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react"; // Import the close icon from Lucide
import { Category } from "../../types";
import { getWhatsAppLink } from "../../utils/whatsapp";

interface Props {
    categories: Category;
    price:number;
    onClose: () => void; // Add a prop for the close function
}

export function OrderForm({ categories, price, onClose }: Props) {

    const [inputs, setInputs] = useState([{ text: '', quantity: '' }]);
    const [storeAddress, setStoreAddress] = useState('');

    const handleInputChange = (index: number, field: 'text' | 'quantity', value: string) => {
        const newInputs = [...inputs];
        newInputs[index][field] = value;
        setInputs(newInputs);
    };

    const addInputField = () => {
        setInputs([...inputs, { text: '', quantity: '' }]);
    };

    const removeInputField = (index: number) => {
        const newInputs = inputs.filter((_, i) => i !== index);
        setInputs(newInputs);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Create message for WhatsApp
        const message = createWhatsAppMessage();
        const whatsappLink = getWhatsAppLink(message);

        // Open WhatsApp link in a new tab
        window.open(whatsappLink, '_blank');

        // Optionally, you can log the inputs and store address
        console.log('Inputs:', inputs);
        console.log('Store Address:', storeAddress);
    };

    // Create WhatsApp message
    const createWhatsAppMessage = () => {
        const items = inputs.map(input => ` Надпись: ${input.text}, Количество: ${input.quantity}, `).join('\n');
        return `Индивидуальный заказ: Категория: ${categories.category_name},\n${storeAddress ? ` Адрес: ${storeAddress}` : ""},\n${items}\nОбщая стоимость: ${calculateTotalCost()} рублей`;
    };

    // Calculate total cost
    const calculateTotalCost = () => {
        return inputs.reduce((total, input) => {
            const quantity = parseInt(input.quantity) || 0; // Convert quantity to number
            return total + quantity * price as number; // Multiply by 100 rubles
        }, 0);
    };

    return (
        <div className="relative my-6 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close"
            >
                <X className="w-6 h-6" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="category" className="block text-lg font-semibold text-gray-800">
                        Категория: {categories.category_name}
                    </label>
                </div>

                {/* New Store Address Input */}
                <div>
                    <label htmlFor="storeAddress" className="block text-base font-medium text-gray-800">
                        Магазин или адрес
                    </label>
                    <input
                        id="storeAddress"
                        value={storeAddress}
                        onChange={(e) => setStoreAddress(e.target.value)}
                        className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                        type="text"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Если вы ранее не заказывали у нас товар, пожалуйста, укажите адрес или название магазина.
                    </p>
                </div>

                {inputs.map((input, index) => (
                    <>
                    <div key={index} className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor={`text-${index}`} className="block text-base font-medium text-gray-800">
                                Надпись или описание изображения
                            </label>
                            <input
                                id={`text-${index}`}
                                value={input.text}
                                onChange={(e) => handleInputChange(index, 'text', e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                                type="text"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor={`quantity-${index}`} className="block text-base font-medium text-gray-800">
                                Количество
                            </label>
                            <input
                                id={`quantity-${index}`}
                                value={input.quantity}
                                onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                                type="number"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeInputField(index)}
                        className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                        aria-label="Удалить поле"
                    >
                        Удалить
                    </button>
                    </>
                ))}

                <button
                    type="button"
                    onClick={addInputField}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Добавить поле</span>
                </button>

                {/* Display total cost */}
                <div className="py-4 border-t border-gray-100">
                    <p className="text-xl font-semibold text-gray-800">
                        Общая стоимость: {calculateTotalCost()} рублей
                    </p>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    Отправить
                </button>
            </form>
        </div>
    );
}