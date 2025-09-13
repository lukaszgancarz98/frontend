import { DeleteOutlined } from '@ant-design/icons';
import type { ProductType } from '../../../api/produktApi';
import type { DisplayProductType, DisplaySize } from './Cart';
import { Dumbbell } from 'lucide-react';

type DispalyProductProps = {
    product: DisplayProductType;
    parentProduct: ProductType;
    functions: {
        deleteFromCart: (id: string) => void;
        deleteWholeProduct: (products: DisplaySize[]) => void;
        addToCard: (id: string) => void;
    };
};

export default function DisplayProductVideo({
    product,
    parentProduct,
    functions,
}: DispalyProductProps) {
    return (
        <div className="flex flex-col border rounded-lg mb-2 p-2">
            <div className="flex flex-row pt-2 px-2">
                <Dumbbell className="h-24 w-24 rounded-lg bg-top object-contain min-w-20 min-h-20 pt-3 mx-2" />
                <div className="pl-2 flex flex-row w-full justify-between">
                    <div>
                        <p className="pt-1 font-bold">{parentProduct?.name}</p>
                        <p className="pt-1 font-light text-xs">
                            {parentProduct?.description}
                        </p>
                    </div>
                    <div className="flex flex-row justify-around items-start p-1">
                        <DeleteOutlined
                            onClick={() =>
                                functions?.deleteWholeProduct([
                                    {
                                        name: '',
                                        id: product?.id,
                                        amount: product?.amount,
                                        price: product.price,
                                    },
                                ])
                            }
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-end content-center items-end pt-5">
                <div className="font-semibold">Cena</div>
                <div>
                    {Number(product?.price)?.toFixed(2).replace('.', ',')} zł
                </div>
            </div>
        </div>
    );
}
