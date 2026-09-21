import RHFCheckbox from "../../common/form/RHFCheckbox";
import RHFInput from "../../common/form/RHFInput";
import RHFTextarea from "../../common/form/RHFTextarea";

export default function GeneralInfoSection({ register, errors, isSaving, isPendingProduct }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md shadow-[#4b2e2e]/5 border border-[#3f6b4c]/10">
      <p className="text-xl font-bold mb-6">Información General</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
          <RHFCheckbox
            id="isActive"
            defaultChecked={true}
            register={register}
            disabled={isSaving || isPendingProduct}
          >
            Mostrar producto
          </RHFCheckbox>
        </div>
        <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
          <RHFInput
            label="Nombre del Producto"
            id="name"
            required={true}
            register={register}
            error={errors?.name}
            disabled={isSaving || isPendingProduct}
          />
        </div>
        <div>
          <RHFInput
            label="Categoría"
            id="category"
            required={true}
            register={register}
            error={errors?.category}
            disabled={isSaving || isPendingProduct}
          />
        </div>
        <div>
          <RHFInput
            label="Precio"
            id="price"
            type="number"
            step="0.01"
            required={true}
            register={register}
            error={errors?.price}
            min={0}
            disabled={isSaving || isPendingProduct}
          />
        </div>
        <div>
          <RHFInput
            label="Cantidad"
            id="stockQuantity"
            type="number"
            required={true}
            register={register}
            error={errors?.stockQuantity}
            min={0}
            disabled={isSaving || isPendingProduct}
          />
        </div>
        <div>
          <RHFInput
            label="Umbral inventario bajo"
            id="lowStockThreshold"
            type="number"
            required={true}
            register={register}
            error={errors?.lowStockThreshold}
            min={0}
            disabled={isSaving || isPendingProduct}
          />
        </div>
        <div>
          <RHFInput
            label="Descuento (%)"
            id="discountPercentage"
            type="number"
            step="0.01"
            register={register}
            error={errors?.discountPercentage}
            min={0}
            max={100}
            disabled={isSaving || isPendingProduct}
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
          <RHFTextarea
            label="Descripción"
            id="description"
            required={true}
            register={register}
            error={errors?.description}
            disabled={isSaving || isPendingProduct}
            rows={5}
          />
        </div>
      </div>
    </div>
  );
}
