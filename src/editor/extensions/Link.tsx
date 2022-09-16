import styled from "@emotion/styled";
import { FromToProps } from "@remirror/core-types";
import {
  useActive,
  useAttrs,
  useChainedCommands,
  useCurrentSelection,
} from "@remirror/react";
import classNames from "classnames";
import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LinkExtension } from "remirror/extensions";
import Button from "../../button";
import { colors } from "../../theme";
import { extensions, ExtensionType } from "../../types.d";
import ToolbarButton from "../ToolbarButton";

function useFloatingLinkState() {
  const { link } = useAttrs();
  const chain = useChainedCommands();
  const { to } = useCurrentSelection();

  const url = (link()?.href as string) ?? "";
  const [href, setHref] = useState<string>(url);

  const onRemove = useCallback(() => chain.removeLink().focus().run(), [chain]);

  const onSubmit = useCallback(() => {
    let range: FromToProps | undefined;

    if (href === "") {
      chain.removeLink();
    } else {
      chain.updateLink({ href, auto: false }, range);
    }

    chain.focus(range?.to ?? to).run();
  }, [chain, href, to]);

  useEffect(() => {
    setHref(url);
  }, [url]);

  return useMemo(
    () => ({
      href,
      setHref,
      onRemove,
      onSubmit,
    }),
    [href, setHref, onRemove, onSubmit]
  );
}

const FloatingLinkButton: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const active = useActive();
  const { href, setHref, onRemove, onSubmit } = useFloatingLinkState();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) =>
      ref.current &&
      !ref.current.contains(event.target as Node) &&
      setShowModal(false);

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref}>
      <ToolbarButton
        className={classNames({ active: showModal || active.link() })}
        onClick={() => {
          setShowModal(!showModal);
          focus();
        }}
      >
        Link
      </ToolbarButton>
      {showModal && (
        <Modal>
          <div>
            <input
              autoFocus
              placeholder="Enter link..."
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setHref(event.target.value)
              }
              value={href}
              onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
                const { code } = event;

                if (code === "Enter") {
                  onSubmit();
                  setShowModal(false);
                }

                if (code === "Escape") {
                  setShowModal(false);
                }
              }}
            />
            {active.link() && (
              <Button danger onClick={() => (onRemove(), setShowModal(false))}>
                Eliminar
              </Button>
            )}
          </div>
          <div>
            <Button secondary onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => (onSubmit(), setShowModal(false))}>
              Guardar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Link: ExtensionType = {
  extensionFunction: LinkExtension,
  toolbarHandler: FloatingLinkButton,
  name: extensions.link,
};

export default Link;

const Modal = styled.div`
  align-items: center;
  background-color: ${colors.white};
  border: 1px solid ${colors.grey2};
  border-radius: 4px;
  color: ${colors.dark};
  padding: 20px;
  position: absolute;
  transform: translate(calc(20px - 50%), 15px);

  > div {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    margin: 20px -5px 0 -5px;
  }

  &::before {
    content: "";
    background-color: ${colors.white};
    border-left: 1px solid ${colors.grey2};
    border-top: 1px solid ${colors.grey2};
    width: 20px;
    height: 20px;
    display: block;
    position: absolute;
    transform: translate(-50%, 0) rotate(45deg);
    top: -10px;
    left: 50%;
  }
`;
