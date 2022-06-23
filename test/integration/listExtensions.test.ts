import { mkdir, rename } from "fs/promises"
import path from "path"
import extract from "extract-zip"
import { clean, tmpdir } from "../utils/helpers"
import { runCodeServerCommand } from "../utils/runCodeServerCommand"

describe("--list-extensions", () => {
  const testName = "listExtensions"
  const extName = `wesbos.theme-cobalt2`
  const extVersion = "2.1.6"
  const vsixFileName = `${extName}-${extVersion}.vsix`
  let tempDir: string
  let setupFlags: string[]

  beforeEach(async () => {
    await clean(testName)
    tempDir = await tmpdir(testName)
    setupFlags = ["--extensions-dir", tempDir]
    const extensionFixture = path.resolve(`./test/integration/fixtures/${vsixFileName}`)
    // Make folder because this is where we'll move the extension
    const pathToUnpackedExtension = `${tempDir}/${extName}-${extVersion}`
    const tempPathToUnpackedExtension = `${tempDir}/${extName}-temp}`
    await mkdir(path.resolve(pathToUnpackedExtension))
    await extract(extensionFixture, { dir: tempPathToUnpackedExtension })
    await rename(`${tempPathToUnpackedExtension}/extension`, pathToUnpackedExtension)
  })
  it("should list installed extensions", async () => {
    const { stdout } = await runCodeServerCommand([...setupFlags, "--list-extensions"])
    expect(stdout).toMatch(extName)
  }, 20000)
})
