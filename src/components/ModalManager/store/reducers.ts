import {createSlice} from "@reduxjs/toolkit";
import {isMobileDevice} from "../../../helpers/events";
import React from "react";

interface IModal {
    id: number;
    name: string;
    isOpened: boolean;
    zindex: number;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

interface IModals {
     current: IModal;
     top: number;
     opened: {
        [key: number]: IModal
    };
     all: {
        [key: string]: IModal
    }
     overlays: string[];
}


export const modals = createSlice({
    name: "modals",
    initialState: {
        current = null;
        all = {};
        opened = {};
        overlays = [];
    } as IModals,
    reducers: {
        max() {
            return Math.max.apply(null, Object.values(this.opened));
        }
        open(name: string) {
            this.top = this.max() + 1;
            this.opened[this.id] = this.current;
            this.overlayBody(true);
            this.all[name].setOpened(true);
            return this.top;
        }
        close(name: string, checkOverlay: boolean) {
            if (checkOverlay && this.top !== this.all[name].zindex) return;
            setTimeout(() => {
                this.overlayBody(false);
                delete this.opened[id];
                this.top = this.max();
                this.all[name].setOpened(false);
            }, 0);
        }
        checkState(name: string) {
            return this.all[name].isOpened;
        }
        overlayBody(opened) {
            if (isMobileDevice() && this.current.name.match(/messenger|carousel|filemanager|element|login/)) {
                if (opened) {
                    document.body.classList.add('overlayed');
                    this.overlays.push(name);
                }
                if (!opened) {
                    this.overlays.pop();
                    !this.overlays.length && document.body.classList.remove('overlayed');
                }
            }
        }
        add(modal: IModal) {
            this.all[modal.name] = modal;
        }
        toggle(name: string) {
            if (this.all[name].isOpened) this.close(name, false);
            else this.open(name);
        }
    }
});

export const { actions, reducer } = modals;