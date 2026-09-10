const DESIGN_IMPORTS = new Set([
  '@easecation/design',
  '@easecation/design/compat',
  '@easecation/design/compat/antd',
]);

const RAW_UI_ELEMENTS = {
  button: 'Button or IconButton',
  input: 'Input',
  select: 'Select or Combobox',
  textarea: 'Textarea',
  table: 'Table or QueryDataTable',
};

const COLOR_NAMES =
  '(?:primary|secondary|muted|accent|destructive|danger|warning|success|info|foreground|background|card|popover|panel|surface|sidebar|red|green|blue|yellow|amber|orange|emerald|cyan|sky|indigo|violet|purple|pink|rose|slate|gray|zinc|neutral)';
const TEXT_COLOR = new RegExp(`^text-${COLOR_NAMES}(?:-|/|$)`);
const VISUAL_UTILITY =
  /^(?:bg|border(?:-[xytrblse])?|rounded(?:-[trbl]{1,2})?|shadow|ring|outline|decoration|fill|stroke|from|via|to|opacity|backdrop)(?:-|$)/;

function importedDesignComponents() {
  const names = new Set();
  return {
    names,
    visit(node) {
      if (!DESIGN_IMPORTS.has(node.source.value)) return;
      for (const specifier of node.specifiers) {
        if (specifier.type === 'ImportSpecifier' || specifier.type === 'ImportDefaultSpecifier') {
          names.add(specifier.local.name);
        }
      }
    },
  };
}

function jsxName(node) {
  return node.name.type === 'JSXIdentifier' ? node.name.name : null;
}

function staticAttributeText(attribute) {
  const value = attribute.value;
  if (!value) return '';
  if (value.type === 'Literal') return typeof value.value === 'string' ? value.value : null;
  if (value.type !== 'JSXExpressionContainer') return null;
  const expression = value.expression;
  if (expression.type === 'Literal') {
    return typeof expression.value === 'string' ? expression.value : null;
  }
  if (expression.type === 'TemplateLiteral' && expression.expressions.length === 0) {
    return expression.quasis[0]?.value.cooked ?? '';
  }
  return null;
}

function baseUtility(token) {
  const segments = token.split(':');
  return segments[segments.length - 1].replace(/^!/, '');
}

const noRawUiElements = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require design-system components for standard interactive and data controls.',
    },
    messages: {
      rawElement:
        'Use {{replacement}} from @easecation/design. Disable this rule locally only when native semantics are an explicit product requirement.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: { enum: Object.keys(RAW_UI_ELEMENTS) },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const allowed = new Set(context.options[0]?.allow ?? []);
    return {
      JSXOpeningElement(node) {
        const name = jsxName(node);
        if (!name || allowed.has(name) || !(name in RAW_UI_ELEMENTS)) return;
        context.report({
          node,
          messageId: 'rawElement',
          data: { replacement: RAW_UI_ELEMENTS[name] },
        });
      },
    };
  },
};

const noVisualOverrides = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Keep component appearance owned by EaseCation Design props and tokens.',
    },
    messages: {
      visualClass:
        'Do not override {{component}} appearance with "{{className}}". Use component props, semantic tokens, or add a reusable design-system variant.',
      styleProp:
        'Do not pass style to {{component}}. Use layout wrappers, component props, or ThemeProvider tokens.',
      dynamicClass:
        'Dynamic className on {{component}} cannot be verified. Move layout to a wrapper and express appearance through component props.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowDynamicClassName: { type: 'boolean' },
          allowStyle: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const design = importedDesignComponents();
    const options = context.options[0] ?? {};
    return {
      ImportDeclaration: design.visit,
      JSXOpeningElement(node) {
        const component = jsxName(node);
        if (!component || !design.names.has(component)) return;

        for (const attribute of node.attributes) {
          if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier')
            continue;
          if (attribute.name.name === 'style' && !options.allowStyle) {
            context.report({ node: attribute, messageId: 'styleProp', data: { component } });
            continue;
          }
          if (attribute.name.name !== 'className') continue;

          const className = staticAttributeText(attribute);
          if (className === null) {
            if (!options.allowDynamicClassName) {
              context.report({ node: attribute, messageId: 'dynamicClass', data: { component } });
            }
            continue;
          }

          const visualClass = className
            .split(/\s+/)
            .map(baseUtility)
            .find((utility) => VISUAL_UTILITY.test(utility) || TEXT_COLOR.test(utility));
          if (visualClass) {
            context.report({
              node: attribute,
              messageId: 'visualClass',
              data: { component, className: visualClass },
            });
          }
        }
      },
    };
  },
};

const noCompatImports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Prevent new dependencies on migration-only compatibility APIs.' },
    messages: {
      compatImport:
        'Compatibility imports are migration-only. Use the formal @easecation/design API or document a temporary exception.',
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (
          node.source.value === '@easecation/design/compat' ||
          node.source.value === '@easecation/design/compat/antd'
        ) {
          context.report({ node, messageId: 'compatImport' });
        }
      },
    };
  },
};

const plugin = {
  meta: { name: '@easecation/design' },
  rules: {
    'no-raw-ui-elements': noRawUiElements,
    'no-visual-overrides': noVisualOverrides,
    'no-compat-imports': noCompatImports,
  },
  configs: {},
};

plugin.configs.recommended = {
  plugins: { '@easecation/design': plugin },
  rules: {
    '@easecation/design/no-raw-ui-elements': 'error',
    '@easecation/design/no-visual-overrides': 'error',
  },
};

plugin.configs.strict = {
  plugins: { '@easecation/design': plugin },
  rules: {
    ...plugin.configs.recommended.rules,
    '@easecation/design/no-compat-imports': 'error',
  },
};

export default plugin;
