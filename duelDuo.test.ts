
import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})

test('Draw button displays the div with id = “choices”', async () => {
    await driver.findElement(By.id('draw')).click()
    const displayedDiv = await driver.findElement(By.id('choices')).isDisplayed()
    expect(displayedDiv).toBe(true)
})

test('Wins is displayed on landing page', async () => {
    const displayedWins = await driver.findElement(By.id('wins')).isDisplayed()
    expect(displayedWins).toBe(true)
})
