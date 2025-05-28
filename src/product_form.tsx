// "use client";

// import type React from "react";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Trash2, Plus, Save } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// // Types
// type Attribute = {
//   id: string;
//   name: string;
//   values: string[];
// };

// type VariantAttribute = {
//   attributeId: string;
//   value: string;
// };

// type Variant = {
//   id: string;
//   attributes: VariantAttribute[];
//   basePrice: number;
//   price: number;
//   stock: number;
//   images: string[];
// };

// type Product = {
//   id: string;
//   name: string;
//   attributes: Attribute[];
//   variants: Variant[];
//   images: string[];
// };

// export default function ProductForm() {
//   // Sample initial data based on the provided JSON
//   const initialProduct: Product = {
//     id: "67c9ce8dc326b8c8672d69b6",
//     name: "flycatcher",
//     attributes: [
//       {
//         id: "67bec9787de2d4b1afdb2741",
//         name: "Color",
//         values: ["red", "white"],
//       },
//       {
//         id: "67bec9787de2d4b1afdb2742",
//         name: "Size",
//         values: ["small", "medium", "large"],
//       },
//     ],
//     variants: [
//       {
//         id: "67c9ce8dc326b8c8672d69b8",
//         attributes: [
//           {
//             attributeId: "67bec9787de2d4b1afdb2741",
//             value: "red",
//           },
//           {
//             attributeId: "67bec9787de2d4b1afdb2742",
//             value: "small",
//           },
//         ],
//         basePrice: 21212,
//         price: 21212,
//         stock: 21,
//         images: [
//           "https://res.cloudinary.com/dl8h3byxa/image/upload/v1741278861/a2jhbdbxaba8p3lxnsj8.jpg",
//           "https://res.cloudinary.com/dl8h3byxa/image/upload/v1741278863/azjw10ppbrphmdjrqxb8.jpg",
//         ],
//       },
//       {
//         id: "67c9ce8dc326b8c8672d69ba",
//         attributes: [
//           {
//             attributeId: "67bec9787de2d4b1afdb2741",
//             value: "white",
//           },
//         ],
//         basePrice: 2,
//         price: 22,
//         stock: 1,
//         images: [
//           "https://res.cloudinary.com/dl8h3byxa/image/upload/v1741278865/edegfgny3mlwiikrgusf.jpg",
//         ],
//       },
//     ],
//     images: [
//       "https://res.cloudinary.com/dl8h3byxa/image/upload/v1741278859/tab3vsmha9mxy8e4srgs.jpg",
//     ],
//   };

//   const [product, setProduct] = useState<Product>({
//     attributes: [],
//     id: "",
//     images: [],
//     name: "",
//     variants: [],

//   });
//   const [newAttributeName, setNewAttributeName] = useState("");
//   const [newAttributeValue, setNewAttributeValue] = useState("");
//   const [selectedAttributeId, setSelectedAttributeId] = useState("");

//   // Generate variants based on attribute combinations
//   const generateVariants = (updatedProduct: Product) => {
//     // Get all possible combinations of attribute values
//     const generateCombinations = (
//       attributes: Attribute[],
//       currentIndex: number,
//       currentCombination: VariantAttribute[] = []
//     ): VariantAttribute[][] => {
//       if (currentIndex === attributes.length) {
//         return [currentCombination];
//       }

//       const currentAttribute = attributes[currentIndex];
//       const combinations: VariantAttribute[][] = [];

//       for (const value of currentAttribute.values) {
//         const newCombination = [
//           ...currentCombination,
//           { attributeId: currentAttribute.id, value },
//         ];
//         const nextCombinations = generateCombinations(
//           attributes,
//           currentIndex + 1,
//           newCombination
//         );
//         combinations.push(...nextCombinations);
//       }

//       return combinations;
//     };

//     const attributeCombinations = generateCombinations(
//       updatedProduct.attributes,
//       0
//     );

//     // Map existing variants to their attribute combination string for comparison
//     const existingVariantMap = new Map<string, Variant>();
//     updatedProduct.variants.forEach((variant) => {
//       const key = variant.attributes
//         .sort((a, b) => a.attributeId.localeCompare(b.attributeId))
//         .map((attr) => `${attr.attributeId}:${attr.value}`)
//         .join("-");
//       existingVariantMap.set(key, variant);
//     });

//     // Create a map of base variants by attribute value to inherit properties from
//     const baseVariantMap = new Map<string, Variant>();
//     updatedProduct.variants.forEach((variant) => {
//       variant.attributes.forEach((attr) => {
//         const key = `${attr.attributeId}:${attr.value}`;
//         if (!baseVariantMap.has(key)) {
//           baseVariantMap.set(key, variant);
//         }
//       });
//     });

//     // Create or update variants based on combinations
//     const newVariants: Variant[] = attributeCombinations.map((combination) => {
//       const key = combination
//         .sort((a, b) => a.attributeId.localeCompare(b.attributeId))
//         .map((attr) => `${attr.attributeId}:${attr.value}`)
//         .join("-");

//       if (existingVariantMap.has(key)) {
//         return existingVariantMap.get(key)!;
//       } else {
//         // Try to find a "parent" variant to inherit values from
//         // We'll use the first attribute match as a base
//         let baseVariant: Variant | null = null;

//         // First try to find a variant that matches the most attributes
//         for (let i = combination.length; i > 0; i--) {
//           const partialCombination = combination.slice(0, i);
//           const partialKey = partialCombination
//             .sort((a, b) => a.attributeId.localeCompare(b.attributeId))
//             .map((attr) => `${attr.attributeId}:${attr.value}`)
//             .join("-");

//           const matchingVariant = Array.from(existingVariantMap.entries()).find(
//             ([k, _]) => k.includes(partialKey)
//           );

//           if (matchingVariant) {
//             baseVariant = matchingVariant[1];
//             break;
//           }
//         }

//         // If no match found, try to match any single attribute
//         if (!baseVariant && combination.length > 0) {
//           const firstAttr = combination[0];
//           const key = `${firstAttr.attributeId}:${firstAttr.value}`;
//           if (baseVariantMap.has(key)) {
//             baseVariant = baseVariantMap.get(key)!;
//           }
//         }

//         return {
//           id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//           attributes: combination,
//           basePrice: baseVariant?.basePrice || 0,
//           price: baseVariant?.price || 0,
//           stock: baseVariant?.stock || 0,
//           images: baseVariant?.images || [],
//         };
//       }
//     });

//     return newVariants;
//   };

//   // Add a new attribute
//   const addAttribute = () => {
//     if (!newAttributeName.trim()) return;

//     const newAttribute: Attribute = {
//       id: `attr-${Date.now()}`,
//       name: newAttributeName,
//       values: [],
//     };

//     const updatedProduct = {
//       ...product,
//       attributes: [...product.attributes, newAttribute],
//     };

//     setProduct(updatedProduct);
//     setNewAttributeName("");
//     setSelectedAttributeId(newAttribute.id);
//   };

//   // Delete an attribute
//   const deleteAttribute = (attributeId: string) => {
//     const updatedAttributes = product.attributes.filter(
//       (attr) => attr.id !== attributeId
//     );

//     // Remove this attribute from all variants
//     const updatedVariants = product.variants.map((variant) => ({
//       ...variant,
//       attributes: variant.attributes.filter(
//         (attr) => attr.attributeId !== attributeId
//       ),
//     }));

//     const updatedProduct = {
//       ...product,
//       attributes: updatedAttributes,
//       variants: updatedVariants,
//     };

//     // Regenerate variants
//     const newVariants = generateVariants(updatedProduct);

//     setProduct({
//       ...updatedProduct,
//       variants: newVariants,
//     });

//     if (selectedAttributeId === attributeId) {
//       setSelectedAttributeId(updatedAttributes[0]?.id || "");
//     }
//   };

//   // Update attribute name
//   const updateAttributeName = (attributeId: string, newName: string) => {
//     const updatedAttributes = product.attributes.map((attr) =>
//       attr.id === attributeId ? { ...attr, name: newName } : attr
//     );

//     const updatedProduct = {
//       ...product,
//       attributes: updatedAttributes,
//     };

//     setProduct(updatedProduct);
//   };

//   // Add a new value to an attribute
//   const addAttributeValue = (attributeId: string) => {
//     if (!newAttributeValue.trim()) return;

//     const updatedAttributes = product.attributes.map((attr) => {
//       if (attr.id === attributeId && !attr.values.includes(newAttributeValue)) {
//         return {
//           ...attr,
//           values: [...attr.values, newAttributeValue],
//         };
//       }
//       return attr;
//     });

//     const updatedProduct = {
//       ...product,
//       attributes: updatedAttributes,
//     };

//     // Regenerate variants with the new attribute value
//     const newVariants = generateVariants(updatedProduct);

//     setProduct({
//       ...updatedProduct,
//       variants: newVariants,
//     });
//     setNewAttributeValue("");
//   };

//   // Delete an attribute value
//   const deleteAttributeValue = (attributeId: string, value: string) => {
//     const updatedAttributes = product.attributes.map((attr) => {
//       if (attr.id === attributeId) {
//         return {
//           ...attr,
//           values: attr.values.filter((v) => v !== value),
//         };
//       }
//       return attr;
//     });

//     const updatedProduct = {
//       ...product,
//       attributes: updatedAttributes,
//     };

//     // Regenerate variants without this attribute value
//     const newVariants = generateVariants(updatedProduct);

//     setProduct({
//       ...updatedProduct,
//       variants: newVariants,
//     });
//   };

//   // Update variant details
//   const updateVariant = (
//     variantId: string,
//     field: "basePrice" | "price" | "stock",
//     value: number
//   ) => {
//     const updatedVariants = product.variants.map((variant) => {
//       if (variant.id === variantId) {
//         return {
//           ...variant,
//           [field]: value,
//         };
//       }
//       return variant;
//     });

//     setProduct({
//       ...product,
//       variants: updatedVariants,
//     });
//   };

//   // Get attribute name by ID
//   const getAttributeName = (attributeId: string) => {
//     return (
//       product.attributes.find((attr) => attr.id === attributeId)?.name ||
//       "Unknown"
//     );
//   };

//   // Format variant name based on attributes
//   const formatVariantName = (variant: Variant) => {
//     return variant.attributes
//       .map((attr) => {
//         const attrName = getAttributeName(attr.attributeId);
//         return `${attr.value}`;
//       })
//       .join("-");
//   };

//   // Handle form submission
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Saving product:", product);
//     // Here you would typically send the data to your API
//     alert("Product saved successfully!");
//   };

//   // Set the first attribute as selected by default
//   useEffect(() => {
//     if (product.attributes.length > 0 && !selectedAttributeId) {
//       setSelectedAttributeId(product.attributes[0].id);
//     }
//   }, [product.attributes, selectedAttributeId]);

//   return (
//     <form onSubmit={handleSubmit} className="container mx-auto py-8 max-w-6xl">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Product Configuration</h1>
//         <Button type="submit">
//           <Save className="mr-2 h-4 w-4" />
//           Save Product
//         </Button>
//       </div>

//       {/* Product Name */}
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>Basic Information</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4">
//             <div>
//               <Label htmlFor="productName">Product Name</Label>
//               <Input
//                 id="productName"
//                 value={product.name}
//                 onChange={(e) =>
//                   setProduct({ ...product, name: e.target.value })
//                 }
//                 className="mt-1"
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Attributes Management */}
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>Attributes</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Attribute List */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Attribute Types</h3>
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="New attribute name (e.g. Size)"
//                   value={newAttributeName}
//                   onChange={(e) => setNewAttributeName(e.target.value)}
//                 />
//                 <Button onClick={addAttribute} type="button">
//                   <Plus className="h-4 w-4" />
//                 </Button>
//               </div>

//               <div className="space-y-2 mt-4">
//                 {product.attributes.map((attribute) => (
//                   <div
//                     key={attribute.id}
//                     className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
//                       selectedAttributeId === attribute.id
//                         ? "bg-muted"
//                         : "hover:bg-muted/50"
//                     }`}
//                     onClick={() => setSelectedAttributeId(attribute.id)}
//                   >
//                     <span>{attribute.name}</span>
//                     <div className="flex items-center gap-2">
//                       <Badge>{attribute.values.length}</Badge>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           deleteAttribute(attribute.id);
//                         }}
//                       >
//                         <Trash2 className="h-4 w-4 text-destructive" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Attribute Values */}
//             <div className="space-y-4 md:col-span-2">
//               {selectedAttributeId && (
//                 <>
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-medium">
//                       Values for{" "}
//                       <Input
//                         value={
//                           product.attributes.find(
//                             (attr) => attr.id === selectedAttributeId
//                           )?.name || ""
//                         }
//                         onChange={(e) =>
//                           updateAttributeName(
//                             selectedAttributeId,
//                             e.target.value
//                           )
//                         }
//                         className="inline-block w-auto"
//                       />
//                     </h3>
//                   </div>

//                   <div className="flex gap-2">
//                     <Input
//                       placeholder={`Add value for ${
//                         product.attributes.find(
//                           (attr) => attr.id === selectedAttributeId
//                         )?.name
//                       }`}
//                       value={newAttributeValue}
//                       onChange={(e) => setNewAttributeValue(e.target.value)}
//                     />
//                     <Button
//                       onClick={() => addAttributeValue(selectedAttributeId)}
//                       type="button"
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   <div className="flex flex-wrap gap-2 mt-4">
//                     {product.attributes
//                       .find((attr) => attr.id === selectedAttributeId)
//                       ?.values.map((value) => (
//                         <Badge
//                           key={value}
//                           className="flex items-center gap-1 p-2"
//                         >
//                           {value}
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-4 w-4 ml-1"
//                             onClick={() =>
//                               deleteAttributeValue(selectedAttributeId, value)
//                             }
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </Badge>
//                       ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Variants */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Variants ({product.variants.length})</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="border-b">
//                   <th className="text-left p-2">Variant</th>
//                   {product.attributes.map((attr) => (
//                     <th key={attr.id} className="text-left p-2">
//                       {attr.name}
//                     </th>
//                   ))}
//                   <th className="text-left p-2">Base Price</th>
//                   <th className="text-left p-2">Price</th>
//                   <th className="text-left p-2">Stock</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {product.variants.map((variant) => (
//                   <tr key={variant.id} className="border-b hover:bg-muted/50">
//                     <td className="p-2 font-medium">
//                       {formatVariantName(variant)}
//                     </td>
//                     {product.attributes.map((attr) => (
//                       <td key={attr.id} className="p-2">
//                         {variant.attributes.find(
//                           (va) => va.attributeId === attr.id
//                         )?.value || "-"}
//                       </td>
//                     ))}
//                     <td className="p-2">
//                       <Input
//                         type="number"
//                         value={variant.basePrice}
//                         onChange={(e) =>
//                           updateVariant(
//                             variant.id,
//                             "basePrice",
//                             Number(e.target.value)
//                           )
//                         }
//                         className="w-24"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <Input
//                         type="number"
//                         value={variant.price}
//                         onChange={(e) =>
//                           updateVariant(
//                             variant.id,
//                             "price",
//                             Number(e.target.value)
//                           )
//                         }
//                         className="w-24"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <Input
//                         type="number"
//                         value={variant.stock}
//                         onChange={(e) =>
//                           updateVariant(
//                             variant.id,
//                             "stock",
//                             Number(e.target.value)
//                           )
//                         }
//                         className="w-24"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </form>
//   );
// }
