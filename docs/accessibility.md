Modals are rendered with the following attributes:

`aria-modal="true"`
`role="dialog"`

Additionally, you should use the following props to describe your modal content:

- [aria-labelled-by](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute)
- [aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute)
- [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute)

### role="dialog"

The role of modals defaults to `dialog`. You can specify a different `role`, for example `alertdialog`:
```
  <Modal role='alertdialog' aria-label='Important Notice!>
    Something important here!
  </Modal>`
```

See: [W3 Modal Example](https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html)
