import { css } from "@emotion/react";
import styled from "@emotion/styled";
import classNames from "classnames";
import React, { FC, useEffect, useRef, useState } from "react";
import { adjustColorOpacity, colors } from "../theme";
import DropIcon from "../icons/Drop";
import Dropdown from "./Dropdown";

interface IOption {
  active?: boolean;
  disabled?: boolean;
  element?: JSX.Element;
  label: string;
  value: string;
}

export interface ISelectProps {
  className?: string;
  classNameDropdown?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  options: IOption[];
  placeholder?: string;
  value?: string;
}

const Select: FC<ISelectProps> = ({
  className,
  classNameDropdown,
  onChange,
  options,
  placeholder,
  value,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(ref.current?.offsetWidth || 0);
  }, [expanded]);

  return (
    <Container
      {...props}
      className={classNames({
        active: !!options.find((o) => o.active)?.label,
        [`${className}`]: true,
      })}
      ref={ref}
      expanded={expanded}
    >
      <SelectDropdown
        attachment="top left"
        offset="-10 0"
        isOpen={expanded}
        onClose={() => setExpanded(false)}
        target={
          <StyledSelect
            expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            <div>
              {options.find((o) => o.value === value)?.label ||
                options.find((o) => o.active)?.label ||
                placeholder}
            </div>
            <DropIcon />
          </StyledSelect>
        }
        children={
          <Values width={width}>
            {options.length > 0 ? (
              <div className={classNameDropdown}>
                {options.map(
                  (option, index) =>
                    option.element || (
                      <Value
                        active={value === option.value || option.active}
                        disabled={option.disabled}
                        key={index}
                        onClick={() => (
                          setExpanded(false), onChange?.(option.value)
                        )}
                      >
                        {option.label}
                      </Value>
                    )
                )}
              </div>
            ) : (
              <ValuesEmpty />
            )}
          </Values>
        }
      />
    </Container>
  );
};

export default Select;

const Container = styled.div<{
  disabled?: boolean;
  expanded: boolean;
}>`
  box-sizing: border-box;
  color: ${colors.dark};
  cursor: pointer;
  display: flex;
  align-items: center;
  min-height: 40px;

  &.active,
  &:hover {
    border-color: ${colors.grey1};
  }

  ${(props) =>
    props.expanded &&
    css`
      border-color: ${colors.grey1};

      > div {
        border-color: ${colors.grey1};
      }
    `}

  ${(props) =>
    props.disabled &&
    css`
      color: ${colors.grey5};
      pointer-events: none;

      svg {
        color: ${colors.grey5}!important;
      }
    `}
`;

const SelectDropdown = styled(Dropdown)`
  padding: 0;
`;

const StyledSelect = styled.div<{ expanded: boolean }>`
  align-items: center;
  background-color: transparent;
  border: none;
  box-sizing: border-box;
  display: flex;
  flex: 1;
  height: 40px;
  outline: none;
  padding: 0 15px 0 20px;

  > svg {
    height: 10px;
    ${(props) =>
      props.expanded &&
      css`
        transform: rotate(180deg);
      `}
  }

  div {
    flex: 1;
    overflow: hidden;
    padding-right: 2px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    color: ${colors.dark};
    margin-left: 15px;
  }

  &::placeholder {
    color: ${colors.grey3};
  }
`;

const Values = styled.div<{ width: number }>`
  min-width: ${(props) => props.width}px;

  > div {
    display: flex;
    flex-direction: column;
    width: 100%;

    > * {
      height: 35px;
      box-sizing: border-box;

      &:not(:first-of-type) {
        border-top: solid 1px ${colors.grey5};
      }
    }
  }
`;

const ValuesEmpty = styled.div`
  justify-content: center;
  height: 70px;
  white-space: nowrap;
`;

const Value = styled.div<{ active: boolean; disabled?: boolean }>`
  align-items: center;
  cursor: pointer;
  display: flex;
  padding: 3px 20px;
  white-space: nowrap;

  span {
    margin-left: 10px;
    white-space: nowrap;
  }

  &:hover {
    background-color: ${colors.grey5};
  }

  ${(props) =>
    props.active &&
    css`
      font-weight: bold;
    `}

  ${(props) =>
    props.disabled &&
    css`
      background-color: ${colors.grey6};
      border-color: ${colors.grey4};
      color: ${colors.grey4};
      pointer-events: none;
    `}
`;
