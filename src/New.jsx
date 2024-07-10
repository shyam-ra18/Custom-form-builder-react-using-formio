// src/components/FormBuilder.js
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const ItemTypes = {
    FIELD: 'field',
};

const DraggableField = ({ type, label }) => {
    const [, drag] = useDrag(() => ({
        type: ItemTypes.FIELD,
        item: { type, label },
    }));
    return (
        <div ref={drag} className="p-2 m-2 bg-gray-300 rounded cursor-move hover:bg-gray-400">
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
        <div ref={drop} className="min-h-screen p-4 bg-gray-100 border-dashed border-2 border-gray-300">
            {fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-2 bg-white border rounded mb-2 shadow">
                    <div className="flex-1">
                        <label className="mr-2">{field.label}</label>
                        <input type={field.type} value={field.value} readOnly className="border rounded p-1 w-full" />
                    </div>
                    <div className="flex items-center">
                        <button onClick={() => openModal(field)} className="ml-2 p-1 text-blue-500">
                            <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => deleteField(field.id)} className="ml-2 p-1 text-red-500">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const FieldModal = ({ isOpen, closeModal, field, saveField }) => {
    const [formData, setFormData] = useState({ ...field });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = () => {
        saveField(formData);
        closeModal();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    </Transition.Child>

                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                Edit Field
                            </Dialog.Title>
                            <div className="mt-2">
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
                            </div>

                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

const New = () => {
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
            <div className="flex">
                <div className="w-1/4 p-4 bg-gray-200">
                    <h3 className="text-xl mb-4">Field Types</h3>
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
                />
            )}
        </DndProvider>
    );
};

export default New;
