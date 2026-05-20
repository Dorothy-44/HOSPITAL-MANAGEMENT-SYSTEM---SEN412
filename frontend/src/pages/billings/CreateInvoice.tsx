import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Send, Plus, Trash2, Search } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

const invoiceSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.number().min(0, "Price must be positive"),
        total: z.number(),
      }),
    )
    .min(1, "At least one item is required"),
  discount: z.number().min(0).max(100).optional(),
  tax: z.number().min(0).max(100).optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { description: "", quantity: 1, unitPrice: 0, total: 0 },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
      discount: 0,
      tax: 0,
    },
  });

  const addItem = () => {
    setItems([
      ...items,
      { description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "unitPrice") {
      newItems[index].total =
        newItems[index].quantity * newItems[index].unitPrice;
    }

    setItems(newItems);
    setValue("items", newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = watch("discount") || 0;
    const tax = watch("tax") || 0;
    const afterDiscount = subtotal - (subtotal * discount) / 100;
    return afterDiscount + (afterDiscount * tax) / 100;
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      console.log("Create invoice:", data);
      navigate("/billings");
    } catch (error) {
      console.error("Failed to create invoice:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
            <p className="text-gray-600">Generate a new billing invoice</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </div>

      <form className="space-y-6">
        {/* Patient & Date Info */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  {...register("patientId")}
                  placeholder="Search patient..."
                  className="pl-10"
                />
              </div>
              {errors.patientId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.patientId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <Input {...register("dueDate")} type="date" />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dueDate.message}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Invoice Items */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Invoice Items</h2>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 w-1/3">
                    Description
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 w-1/6">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 w-1/6">
                    Unit Price
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 w-1/6">
                    Total
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 w-1/12">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-2">
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                        placeholder="Item description"
                        className="w-full"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseInt(e.target.value),
                          )
                        }
                        min="1"
                        className="w-20"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "unitPrice",
                            parseFloat(e.target.value),
                          )
                        }
                        min="0"
                        step="0.01"
                        className="w-32"
                      />
                    </td>
                    <td className="py-3 px-2 font-medium">
                      ${item.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-end">
              <div className="w-72 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Discount (%)</span>
                  <Input
                    {...register("discount", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="100"
                    className="w-20 text-right"
                  />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Tax (%)</span>
                  <Input
                    {...register("tax", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="100"
                    className="w-20 text-right"
                  />
                </div>

                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Notes */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
          <Textarea
            {...register("notes")}
            placeholder="Add any additional notes or payment instructions..."
            rows={4}
          />
        </Card>
      </form>
    </div>
  );
};
