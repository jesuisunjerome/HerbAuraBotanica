import { Suspense } from "react";

// HOC para manejar el estado de carga (Suspense)
export const Loadable = (WrappedComponent) => {
    return function LoadableComponent(props) {
        return (
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3f6b4c]"></div>
                    <p className="mt-4 text-[#3f6b4c] font-medium animate-pulse">Cargando...</p>
                </div>
            }>
                <WrappedComponent {...props} />
            </Suspense>
        );
    }
};