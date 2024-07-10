// src/FormBuilder.js
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import Modal from 'react-modal';
import 'tailwindcss/tailwind.css';

const ItemTypes = {
    FIELD: 'field',
};

const DraggableField = ({ type, label }) => {
    const [, drag] = useDrag(() => ({
        type: ItemTypes.FIELD,
        item: { type, label },
    }));
    return (
        <div ref={drag} className="p-2 m-2 bg-gray-300 rounded cursor-move hover:bg-gray-400 text-black ">
            {label}
        </div>
    );
};

const DroppableArea = ({ fields, setFields, openModal }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.FIELD,
        drop: (item) => addField(item),
    });

    const addField = (field) => {
        setFields((prevFields) => [
            ...prevFields,
            { id: Date.now(), type: field.type, label: field.label, value: '' },
        ]);
    };

    return (
        <div ref={drop} className="min-h-screen w-[70vw]  p-4 bg-[#FFF6E9] border-dashed border-2 border-gray-800 rounded-lg">
            {fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-2 bg-white border rounded mb-2 shadow">
                    <div className="flex-1">
                        <label className="mr-2">{field.label}</label>
                        <input type={field.type} value={field.value} readOnly className="border rounded p-1 w-full" />
                    </div>
                    <button onClick={() => openModal(field)} className="ml-2 p-1 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L3 14.172V17h2.828L17.414 5.414a2 2 0 000-2.828zM4 16v-2.828l9-9L13.828 3 4 12.828V16h2.828l9-9L16 6.828 6.828 16H4z" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
};

const FieldModal = ({ isOpen, closeModal, field, saveField, deleteField }) => {
    const [formData, setFormData] = useState({ ...field });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = () => {
        saveField(formData);
        closeModal();
    };

    const handleDelete = () => {
        deleteField(field.id);
        closeModal();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={closeModal} className="bg-white p-4 border rounded mx-auto my-20 max-w-md shadow-lg">
            <h2 className="text-xl mb-4">Edit Field</h2>
            <label className="block mb-2">Label</label>
            <input
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="border rounded w-full p-2 mb-4"
            />
            <label className="block mb-2">Value</label>
            <input
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="border rounded w-full p-2 mb-4"
            />
            <div className="flex justify-end">
                <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded mr-2">Save</button>
                <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">Delete</button>
            </div>
        </Modal>
    );
};

const FormBuilder = () => {
    const [fields, setFields] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentField, setCurrentField] = useState(null);

    const openModal = (field) => {
        setCurrentField(field);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setCurrentField(null);
    };

    const saveField = (updatedField) => {
        const index = fields.findIndex((field) => field.id === updatedField.id);
        const updatedFields = update(fields, {
            [index]: { $set: updatedField },
        });
        setFields(updatedFields);
    };

    const deleteField = (id) => {
        setFields(fields.filter((field) => field.id !== id));
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-row items-center ">
                <div className="w-1/4 p-4 bg-gray-200 rounded-lg">
                    <h3 className="text-xl mb-4 text-black">Field Types</h3>
                    <DraggableField type="text" label="Text Input" />
                    <DraggableField type="textarea" label="Text Area" />
                    <DraggableField type="radio" label="Radio" />
                    <DraggableField type="checkbox" label="Checkbox" />
                    <DraggableField type="select" label="Select" />
                    <DraggableField type="file" label="File Upload" />
                    <DraggableField type="signature" label="Signature" />
                    <DraggableField type="dropdown" label="Dropdown" />
                    {/* Add more field types here */}
                </div>
                <div className="w-3/4 p-4">
                    <h3 className="text-xl mb-4">Form</h3>
                    <DroppableArea fields={fields} setFields={setFields} openModal={openModal} />
                </div>
            </div>
            <div className="mt-4 p-4">
                <h3 className="text-xl mb-4">Generated JSON</h3>
                <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(fields, null, 2)}</pre>
            </div>
            {currentField && (
                <FieldModal
                    isOpen={modalIsOpen}
                    closeModal={closeModal}
                    field={currentField}
                    saveField={saveField}
                    deleteField={deleteField}
                />
            )}
        </DndProvider>
    );
};

export default FormBuilder;
