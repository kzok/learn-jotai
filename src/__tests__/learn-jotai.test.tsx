import { render, screen, act, fireEvent } from "@testing-library/react";
import { atom, createStore } from "jotai";
import { Provider, useAtomValue, useSetAtom, useStore } from "jotai/react";
import { useHydrateAtoms } from "jotai/react/utils";
import { atomWithDefault } from "jotai/utils";
import React, { Suspense, useRef } from "react";
import { useState, useEffect } from "react";
import { setTimeout } from "timers/promises";
import { it, expect, describe, beforeEach, vitest, afterEach } from "vitest";

describe("vanilla", () => {
  it("primitive atom works.", () => {
    const nameAtom = atom<string>("");
    const store = createStore();
    store.set(nameAtom, "foo");
    expect(store.get(nameAtom)).toBe("foo");
    store.set(nameAtom, "bar");
    expect(store.get(nameAtom)).toBe("bar");
  });

  it("async atom works", async () => {
    type Data = Readonly<{ name: string }>;
    const fetchAtom = atom(async (): Promise<Data> => {
      await setTimeout(100);
      return { name: "foo" };
    });
    const nameAtom = atomWithDefault<string>(
      async (get) => (await get(fetchAtom)).name
    );
    const store = createStore();
    expect(await store.get(fetchAtom)).toEqual({ name: "foo" });
    expect(await store.get(nameAtom)).toBe("foo");
  });

  it("atom can throw an error", async () => {
    const rawNameAtom = atom<string | Promise<string> | null>(null);
    const nameAtom = atom(async (get): Promise<string> => {
      const data = get(rawNameAtom);
      if (data == null) {
        throw new RangeError("cannot access rawNameAtom before initializing.");
      }
      return await data;
    });
    const store = createStore();
    await expect(() => store.get(nameAtom)).rejects.toThrowError();
    store.set(rawNameAtom, Promise.resolve("foo"));
    expect(await store.get(nameAtom)).toBe("foo");
  });
});

describe("react", () => {
  // suppress noisy console.error().
  beforeEach(
    () => void vitest.spyOn(console, "error").mockImplementation(() => {})
  );
  afterEach(() => void vitest.clearAllMocks());

  it("an error thrown by atom can be caught by error boundary.", async () => {
    const throwAtom = atom((): string => {
      throw new RangeError("an example error occured.");
    });
    const Consumer: React.FC = () => <p>{useAtomValue(throwAtom)}</p>;
    class ErrorBoundary extends React.Component {
      override state: { error: Error | null } = { error: null };
      override componentDidCatch(error: Error): void {
        this.setState({ error });
      }
      override render() {
        if (this.state.error == null) {
          return <Consumer />;
        }
        return this.state.error.toString();
      }
    }
    render(<ErrorBoundary />);
    expect(
      await screen.findByText("RangeError: an example error occured.")
    ).not.toBeNull();
  });

  it("use of setter in the render phase works.", async () => {
    const rawDataAtom = atom<{ name: string } | null>(null);
    const useData = (): { name: string } => {
      let value = useAtomValue(rawDataAtom);
      const setter = useSetAtom(rawDataAtom);
      if (value != null) {
        return value;
      }
      value = { name: "foo" };
      setter(value);
      return value;
    };
    const Consumer: React.FC = () => {
      const data = useData();
      const render = useRef(0);
      render.current += 1;
      return (
        <>
          <p>render: {render.current}</p>
          <p>data: {data.name}</p>
        </>
      );
    };
    render(<Consumer />);
    expect(await screen.findByText("render: 2")).not.toBeNull();
    expect(await screen.findByText("data: foo")).not.toBeNull();
  });

  it("useHydrateAtoms() works.", async () => {
    const rawDataAtom = atom<{ name: string } | null>(null);
    const dataAtom = atom((get): { name: string } => {
      const value = get(rawDataAtom);
      if (value == null) {
        throw new RangeError(
          "cannot get this atom value before being initialized."
        );
      }
      return value;
    });
    const useData = (): { name: string } => {
      useHydrateAtoms([[rawDataAtom, { name: "foo" }]]);
      return useAtomValue(dataAtom);
    };
    const Consumer: React.FC = () => {
      const data = useData();
      const render = useRef(0);
      render.current += 1;
      return (
        <>
          <p>render: {render.current}</p>
          <p>data: {data.name}</p>
        </>
      );
    };
    render(<Consumer />);
    expect(await screen.findByText("render: 1")).not.toBeNull();
    expect(await screen.findByText("data: foo")).not.toBeNull();
  });
});

it("initializer concept #1", async () => {
  type Data = Readonly<{ name: string }>;
  const queryDataAtom = atom(
    new Promise<Data>(() => {
      /** never ending promise */
    })
  );
  const nameAtom = atomWithDefault<string>(
    async (get) => (await get(queryDataAtom)).name
  );
  const InitializerGuard: React.FC<{ children: React.ReactNode }> = (props) => {
    const [done, setDone] = useState(false);
    const setter = useSetAtom(queryDataAtom);
    useEffect(() => {
      if (done) {
        return;
      }
      setter(Promise.resolve({ name: "foo" }));
      setDone(true);
      return;
    }, []);
    return <>{done ? props.children : null}</>;
  };
  const Consumer: React.FC = () => {
    const setter = useSetAtom(nameAtom);
    return (
      <>
        <p data-testid="text">{useAtomValue(nameAtom)}</p>
        <button onClick={() => setter("bar")}>update</button>
      </>
    );
  };
  await act(async () => {
    render(
      <Provider>
        <Suspense fallback={<p>loading</p>}>
          <InitializerGuard>
            <Consumer />
          </InitializerGuard>
        </Suspense>
      </Provider>
    );
  });
  expect((await screen.findByTestId("text"))!.textContent).toBe("foo");
  fireEvent.click(screen.getByText("update"));
  expect((await screen.findByTestId("text"))!.textContent).toBe("bar");
});

it("initializer concept #2", async () => {
  type Data = Readonly<{ name: string }>;
  const rawQueryDataAtom = atom<Data | null>(null);
  const queryDataAtom = atom(
    (get): Data => {
      const data = get(rawQueryDataAtom);
      if (data == null) {
        throw new RangeError("cannot access query data before initializing.");
      }
      return data;
    },
    (_, set, data: Data) => {
      set(rawQueryDataAtom, data);
    }
  );
  const nameAtom = atomWithDefault<string>((get) => get(queryDataAtom).name);
  const InitializerGuard: React.FC<{ children: React.ReactNode }> = (props) => {
    const store = useStore();
    const isFirst = useRef(true);
    if (isFirst.current) {
      isFirst.current = false;
      store.set(queryDataAtom, { name: "foo" });
    }
    return <>{props.children}</>;
  };
  const Consumer: React.FC = () => {
    const setter = useSetAtom(nameAtom);
    return (
      <>
        <p data-testid="text">{useAtomValue(nameAtom)}</p>
        <button onClick={() => setter("bar")}>update</button>
      </>
    );
  };
  await act(async () => {
    render(
      <Provider>
        <Suspense fallback={<p>loading</p>}>
          <InitializerGuard>
            <Consumer />
          </InitializerGuard>
        </Suspense>
      </Provider>
    );
  });
  expect((await screen.findByTestId("text"))!.textContent).toBe("foo");
  fireEvent.click(screen.getByText("update"));
  expect((await screen.findByTestId("text"))!.textContent).toBe("bar");
});
