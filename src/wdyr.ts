import React from 'react'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    // 这里是追踪所有组件，暂时选为false，只需要追踪我想追踪的就行
    // 在对应的组件下写，比如ProjectListScreen.whyDidYouRender = true
    trackAllPureComponents: false
  })
}
