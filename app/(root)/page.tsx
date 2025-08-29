import {
  Container,
  Title,
  TopBar,
  Filters,
  ProductsGroupList,
} from "@/components/shared";

export default async function Home() {
  return (
    <>
      <Container className="mt-10">
        <Title
          text="Вся продукция"
          size="lg"
          className="font-extrabold"
        ></Title>
      </Container>
      <TopBar />

      <Container className="mt-10 mb-4">
        <div className="flex gap-[60px]">
          {/* Filtretion */}
          <div className="w-[250px]">
            <Filters />
          </div>
          {/* Product list */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              <ProductsGroupList
                title="Армирование"
                categoryId={2}
                items={[
                  {
                    id: 1,
                    name: "Армирование",
                    imageUrl:
                      "http://ldm-steel.com/wp-content/uploads/image/armaluplast/aluplast1.png",
                    price: 6000,
                    items: [{ price: 6000 }],
                  },
                  {
                    id: 2,
                    name: "Армирование",
                    imageUrl:
                      "http://ldm-steel.com/wp-content/uploads/image/armaluplast/aluplast1.png",
                    price: 6000,
                    items: [{ price: 6000 }],
                  },
                  {
                    id: 3,
                    name: "Армирование",
                    imageUrl:
                      "http://ldm-steel.com/wp-content/uploads/image/armaluplast/aluplast1.png",
                    price: 6000,
                    items: [{ price: 6000 }],
                  },
                  {
                    id: 4,
                    name: "Армирование",
                    imageUrl:
                      "http://ldm-steel.com/wp-content/uploads/image/armaluplast/aluplast1.png",
                    price: 6000,
                    items: [{ price: 6000 }],
                  },
                  {
                    id: 5,
                    name: "Армирование",
                    imageUrl:
                      "http://ldm-steel.com/wp-content/uploads/image/armaluplast/aluplast1.png",
                    price: 6000,
                    items: [{ price: 6000 }],
                  },
                  {
                    id: 6,
                    name: "Профиль",
                    imageUrl:
                      "http://ldm-steel.com/wp-content/uploads/image/armaluplast/aluplast1.png",
                    price: 6000,
                    items: [{ price: 6000 }],
                  },
                  {
                    id: 7,
                    name: "Профиль",
                    imageUrl:
                      "http://ldm-steel.com/wp-content/uploads/image/armaluplast/aluplast1.png",
                    price: 6000,
                    items: [{ price: 6000 }],
                  },
                ]}
                listClassName={""}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
