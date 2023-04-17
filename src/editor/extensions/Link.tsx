import { useCurrentSelection, useRemirrorContext } from "@remirror/react";
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
import Button from "../../atoms/button";
import Input from "../../atoms/input";
import LinkIcon from "../assets/icons/Link";
import { Modal, ToolbarButton } from "../components";

export const LinkName = "link";

export type LinkAttrs = {
  autoLink?: boolean;
  defaultTarget?: string;
};

function useFloatingLinkState() {
  const { to, from } = useCurrentSelection();
  const { chain, attrs } = useRemirrorContext({ autoUpdate: true });

  const hrefLink = (attrs.link()?.href as string) ?? "";
  const targetLink = (attrs.link()?.target as string) ?? "";
  const [href, setHref] = useState(hrefLink);
  const [target, setTarget] = useState(targetLink);

  const onRemove = useCallback(() => chain.removeLink().focus().run(), [chain]);

  const onSubmit = useCallback(() => {
    if (href === "") {
      chain.removeLink();
    } else {
      chain.updateLink({ href, target, auto: false }, { to, from });
    }

    chain.focus({ to, from }).run();
  }, [chain, href, target, to]);

  useEffect(() => {
    setHref(hrefLink);
  }, [hrefLink]);

  useEffect(() => {
    setTarget(targetLink);
  }, [targetLink]);

  return useMemo(
    () => ({
      href,
      setHref,
      target,
      setTarget,
      onRemove,
      onSubmit,
    }),
    [href, setHref, onRemove, onSubmit]
  );
}

const LinkButton: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { href, setHref, target, setTarget, onRemove, onSubmit } =
    useFloatingLinkState();
  const [showModal, setShowModal] = useState(false);
  const { active } = useRemirrorContext({ autoUpdate: true });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showModal]);

  return (
    <div ref={ref}>
      <ToolbarButton
        className={classNames({ active: showModal || active.link() })}
        onClick={() => {
          setShowModal(!showModal);
        }}
      >
        <LinkIcon />
      </ToolbarButton>
      {showModal && (
        <Modal>
          <div>
            <label>Link*</label>
            <Input
              autoFocus
              placeholder="Link"
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
          </div>
          {/* <div> // TODO: Not working
            <Checkbox
              checked={target === "_blank"}
              onChange={(checked) => setTarget(checked ? "_blank" : "_self")}
            />
            <label>Open in new tab</label>
          </div> */}
          <div>
            {active.link() ? (
              <Button danger onClick={() => (onRemove(), setShowModal(false))}>
                Eliminar
              </Button>
            ) : (
              <Button secondary onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
            )}
            <Button onClick={() => (onSubmit(), setShowModal(false))}>
              Guardar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export { LinkButton, LinkExtension };
