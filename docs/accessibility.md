Modals are rendered with the following attributes:

`role="dialog"`

`aria-modal="true"`

### role="dialog"

The role of modals defaults to `dialog`. You can specify a different `role`, for example `alertdialog`:

```
  <Modal role='alertdialog' aria-label='Important Notice!>
    Something important here!
  </Modal>`
```

The role can also be set on  `<ModalRoute />` and `<ModalLink />`.

### aria-*

You should use the following props to describe your modal content:

- [aria-labelledby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute)
- [aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute)
- [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute)

Any props set on `<Modal />`, `<ModalRoute />`, or `<ModalLink />` that start with `aria-` will be rendered on the modal element.

For example:
```
<Modal aria-labelledby="modal-title" aria-describedby="modal-description">
  <h3 id="modal-title">Important Information</h3>
  <p id="modal-description">
    A description of the purpose of this modal. 
  </p>
  ... additional modal content here ...
</Modal>
```


See: [W3 Modal Example](https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html)
